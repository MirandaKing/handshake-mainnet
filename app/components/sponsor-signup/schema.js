export const sponsorSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),

  organizationName: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  // .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  network: z.string().default("BTTC"), // Default is BTTC
  sponsorshipLimit: z
    .string()
    .min(1, "Sponsorship limit is required")
    .regex(/^\d+$/, "Sponsorship limit must be a number"), // Validates if it's a number
  sponsorshipFrequency: z
    .string()
    .min(1, "Sponsorship frequency is required")
    .refine((value) => ["per_transaction", "daily", "weekly"].includes(value), {
      message: "Invalid sponsorship frequency",
    }),
  videoUrl: z.string().url("Invalid URL").optional(),
  adDuration: z.string().optional(),
  adDescription: z.string().optional(),
  termsAccepted: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
  adVideoFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true; // File is optional
      const fileSizeInMB = file.size / (1024 * 1024); // Convert to MB
      return fileSizeInMB <= 50; // Max 10MB size
    }, "Video file size must be less than 50MB"),
});
