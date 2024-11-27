"use client";
import { Send } from "lucide-react";
import { useState } from "react";

const SponsorSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    country: "",
    walletAddress: "",
    network: "BTTC",
    sponsorshipLimit: "",
    token: "",
    transactionType: "",
    sponsorshipFrequency: "",
    videoUrl: "",
    adDuration: "",
    adDescription: "",
    termsAccepted: false,
    adVideoFile: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Handle form submission logic here (e.g., sending data to API)
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pt-[100px] font-dmsans">
      <div className="bg-white p-4 rounded-b-lg shadow max-w-3xl">
        <div className="p-2 md:p-8 md:pt-2">
          <h1 className="text-3xl font-bold text-center text-black mb-6 font-dmsans">
            Become a Sponsor
          </h1>
          <span className="text-black text-sm">
            Fill out this form to become a sponsor and pay gas fees for users
            who watch your ad.
          </span>
          <h2 className="text-2xl font-semibold mb-4">Sponsor Sign-Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="example@example.com"
                required
              />
            </div>

            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name (optional)
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="Company Name"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="USA"
                required
              />
            </div>

            {/* Wallet Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="0x123..."
                required
              />
            </div>

            {/* Preferred Network */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Network
              </label>
              <input
                type="text"
                name="network"
                value={formData.network}
                disabled
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="0x123..."
                required
              />
            </div>

            {/* Sponsorship Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sponsorship Amount Limit
              </label>
              <input
                type="number"
                name="sponsorshipLimit"
                value={formData.sponsorshipLimit}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="1000"
                required
              />
            </div>

            {/* Sponsorship Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sponsorship Frequency
              </label>
              <select
                name="sponsorshipFrequency"
                value={formData.sponsorshipFrequency}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                required
              >
                <option value="">Select Frequency</option>
                <option value="per_transaction">Per Transaction</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {/* Ad Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Video URL (optional)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="https://example.com/video"
              />
            </div>

            {/* Ad Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Ad Video (optional)
              </label>
              <input
                type="file"
                name="adVideoFile"
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                accept="video/*"
              />
            </div>

            {/* Ad Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Description (optional)
              </label>
              <textarea
                name="adDescription"
                value={formData.adDescription}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${"border-gray-300"}`}
                placeholder="Brief description of your ad..."
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                I agree to the terms and conditions
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#29FF81] text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <Send className="w-5 h-5 text-black" />
                    <span className="ml-2">Become a Sponsor </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SponsorSignUp;
