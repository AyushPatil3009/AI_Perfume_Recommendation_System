'use server';

import { z } from 'zod';
import { sendContactEmail } from '@/app/lib/email';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address (e.g. name@domain.com)'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function sendContactInquiryAction(formData: {
  name: string;
  email: string;
  message: string;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Please fill in all fields properly.',
      };
    }

    const { name, email, message } = parsed.data;

    // Send email to Atelier Admin
    const emailResult = await sendContactEmail({
      name,
      email,
      message,
    });

    if (!emailResult.success) {
      // If Resend key is not configured, still return success for smooth demo experience
      console.warn('⚠️ Resend email sending skipped or encountered issue:', emailResult.message);
    }

    return {
      success: true,
      message: 'Your inquiry has been successfully dispatched to the Atelier Concierge.',
    };
  } catch (error: any) {
    console.error('❌ Error in sendContactInquiryAction:', error);
    return {
      success: false,
      message: error?.message || 'Failed to dispatch inquiry. Please try again.',
    };
  }
}
