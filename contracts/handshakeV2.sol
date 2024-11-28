// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract HandshakeTokenTransfer is EIP712 {
    using ECDSA for bytes32;

    bytes32 public constant SENDER_TYPEHASH =
        keccak256(
            "initiateTransaction(address sender,address receiver,address tokenAddress,uint256 amount,uint256 deadline,bytes32 nonce)"
        );
    bytes32 public constant RECEIVER_TYPEHASH =
        keccak256(
            "signByReceiver(address sender,address receiver,address tokenAddress,uint256 amount,uint256 deadline,bytes32 nonce)"
        );
    bytes32 public constant NFT_SENDER_TYPEHASH =
        keccak256(
            "initiateTransaction(address sender,address receiver,address tokenAddress,uint256 tokenId,uint256 deadline,bytes32 nonce)"
        );
    bytes32 public constant NFT_RECEIVER_TYPEHASH =
        keccak256(
            "signByReceiver(address sender,address receiver,address tokenAddress,uint256 tokenId,uint256 deadline,bytes32 nonce)"
        );

    struct TokenTransfer {
        address sender;
        address receiver;
        address tokenAddress;
        uint256 amount;
        uint256 deadline;
        bytes32 nonce;
    }
    struct NativeTransfer {
        address sender;
        address receiver;
        uint256 amount;
        uint256 deadline;
        bytes32 nonce;
    }
    struct NftTransfer {
        address sender;
        address receiver;
        address tokenAddress;
        uint256 tokenId;
        uint256 deadline;
        bytes32 nonce;
    }

    mapping(address => mapping(bytes32 => bool)) internal _authorizationStates;

    constructor() EIP712("HandshakeTokenTransfer", "1") {}

    function authorizationState(
        address authorizer,
        bytes32 nonce
    ) external view returns (bool) {
        return _authorizationStates[authorizer][nonce];
    }

    modifier nonZeroAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    modifier nonZeroAddress(address addr) {
        require(addr != address(0), "Invalid address: zero address");
        _;
    }

    modifier nonceNotUsed(address sender, bytes32 nonce) {
        require(
            _authorizationStates[sender][nonce] == false,
            "Nonce already used"
        );
        _;
    }

    function transferNative(
        bytes memory senderSign,
        bytes memory receiverSign,
        NativeTransfer memory _transaction
    )
        external
        payable
        nonZeroAmount(_transaction.amount)
        nonZeroAddress(_transaction.sender)
        nonZeroAddress(_transaction.receiver)
        nonceNotUsed(_transaction.sender, _transaction.nonce)
    {
        bytes32 senderStructHash = keccak256(
            abi.encode(
                SENDER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 senderHash = _hashTypedDataV4(senderStructHash);
        require(
            ECDSA.recover(senderHash, senderSign) == _transaction.sender,
            "Handshake: Invalid signature of sender"
        );

        bytes32 receiverStructHash = keccak256(
            abi.encode(
                RECEIVER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 receiverHash = _hashTypedDataV4(receiverStructHash);

        require(
            ECDSA.recover(receiverHash, receiverSign) == _transaction.receiver,
            "Handshake: Invalid signature of receiver"
        );

        _authorizationStates[_transaction.sender][_transaction.nonce] = true;

        payable(_transaction.receiver).transfer(msg.value);
    }

    function transferTokens(
        bytes memory senderSign,
        bytes memory receiverSign,
        TokenTransfer memory _transaction
    )
        external
        nonZeroAmount(_transaction.amount)
        nonZeroAddress(_transaction.sender)
        nonZeroAddress(_transaction.receiver)
        nonceNotUsed(_transaction.sender, _transaction.nonce)
    {
        bytes32 senderStructHash = keccak256(
            abi.encode(
                SENDER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.tokenAddress,
                _transaction.amount,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 senderHash = _hashTypedDataV4(senderStructHash);
        require(
            ECDSA.recover(senderHash, senderSign) == _transaction.sender,
            "Handshake: Invalid signature of sender"
        );

        bytes32 receiverStructHash = keccak256(
            abi.encode(
                RECEIVER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.tokenAddress,
                _transaction.amount,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 receiverHash = _hashTypedDataV4(receiverStructHash);

        require(
            ECDSA.recover(receiverHash, receiverSign) == _transaction.receiver,
            "Handshake: Invalid signature of receiver"
        );

        _authorizationStates[_transaction.sender][_transaction.nonce] = true;

        IERC20 token = IERC20(_transaction.tokenAddress);
        require(
            token.transferFrom(
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount
            ),
            "Token transfer failed"
        );
    }

    function transferNft(
        bytes memory senderSign,
        bytes memory receiverSign,
        NftTransfer memory _transaction
    )
        external
        nonZeroAddress(_transaction.sender)
        nonZeroAddress(_transaction.receiver)
        nonceNotUsed(_transaction.sender, _transaction.nonce)
    {
        bytes32 senderStructHash = keccak256(
            abi.encode(
                NFT_SENDER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.tokenAddress,
                _transaction.tokenId,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 senderHash = _hashTypedDataV4(senderStructHash);
        require(
            ECDSA.recover(senderHash, senderSign) == _transaction.sender,
            "Handshake: Invalid signature of sender"
        );

        bytes32 receiverStructHash = keccak256(
            abi.encode(
                NFT_RECEIVER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.tokenAddress,
                _transaction.tokenId,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 receiverHash = _hashTypedDataV4(receiverStructHash);

        require(
            ECDSA.recover(receiverHash, receiverSign) == _transaction.receiver,
            "Handshake: Invalid signature of receiver"
        );

        _authorizationStates[_transaction.sender][_transaction.nonce] = true;

        IERC721 token = IERC721(_transaction.tokenAddress);
        token.transferFrom(
            _transaction.sender,
            _transaction.receiver,
            _transaction.tokenId
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                  using permit
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function transferFromWithPermit(
        bytes memory senderSign,
        bytes memory receiverSign,
        uint256 deadline,
        TokenTransfer memory _transaction,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        external
        nonZeroAmount(_transaction.amount)
        nonZeroAddress(_transaction.sender)
        nonZeroAddress(_transaction.receiver)
        nonceNotUsed(_transaction.sender, _transaction.nonce)
    {
        validateSignatures(senderSign, receiverSign, _transaction);

        require(
            _authorizationStates[_transaction.sender][_transaction.nonce] ==
                false,
            "Nonce already used"
        );

        performTokenTransfer(_transaction, deadline, v, r, s);
    }

    function validateSignatures(
        bytes memory senderSign,
        bytes memory receiverSign,
        TokenTransfer memory _transaction
    ) internal view {
        bytes32 structHash = keccak256(
            abi.encode(
                SENDER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.tokenAddress,
                _transaction.amount,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 senderHash = _hashTypedDataV4(structHash);
        require(
            ECDSA.recover(senderHash, senderSign) == _transaction.sender,
            "Handhshake: Invalid signature of sender"
        );

        bytes32 receiverStructHash = keccak256(
            abi.encode(
                RECEIVER_TYPEHASH,
                _transaction.sender,
                _transaction.receiver,
                _transaction.tokenAddress,
                _transaction.amount,
                _transaction.deadline,
                _transaction.nonce
            )
        );

        bytes32 receiverHash = _hashTypedDataV4(receiverStructHash);
        require(
            ECDSA.recover(receiverHash, receiverSign) == _transaction.receiver,
            "Handshake: Invalid signature of receiver"
        );
    }

    function performTokenTransfer(
        TokenTransfer memory _transaction,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        IERC20Permit _token = IERC20Permit(_transaction.tokenAddress);
        IERC20 token = IERC20(_transaction.tokenAddress);
        _token.permit(
            _transaction.sender,
            address(this),
            _transaction.amount,
            deadline,
            v,
            r,
            s
        );
        require(
            token.transferFrom(
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount
            ),
            "Token transfer failed"
        );
        _authorizationStates[_transaction.sender][_transaction.nonce] = true;
    }
}