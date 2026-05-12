import { GoogleGenerativeAI } from "@google/generative-ai";

// @ts-ignore
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const parseInvoice = async (input: string, isFile = false): Promise<any> => {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    Extract ALL possible invoice data from the provided ${isFile ? "document" : "text"} and return it as a VALID JSON object.
    Be thorough and try to find every detail to fill the form completely.
    
    JSON Fields to extract (organized by form sections):

    [Invoice Information]
    - invoice_number: The unique identifier of the invoice.
    - process_date: The date the invoice was issued (format YYYY-MM-DD).
    - due_date: The deadline for payment (format YYYY-MM-DD).

    [Customer Details]
    - customer_name: Name of the company or individual being billed.
    - customer_id: Customer ID or Tax ID of the customer.
    - customer_address: Full billing address of the customer.

    [Contact & Payment]
    - previous_balance: Any unpaid balance brought forward from before (number).
    - contact_person: Name of the specific contact person at the customer's company.
    - contact_phone: Phone number for contact.
    - payment_account: Bank name, account number, or payment instructions.
    - contact_email: Email address for contact.

    [Notes]
    - notes: Any additional terms, conditions, or messages.

    [Items]
    - items: An array of objects for each line item. Each item must have:
        - name: Short title of the product or service.
        - description: Detailed description if available.
        - qty: Quantity (number).
        - price: Unit price (number).
        - subtotal: qty * price (number).
        - amount: Total amount for this line (number).

    Important instructions:
    1. If a field is not explicitly found, leave it as an empty string "" or 0 for numbers.
    2. Convert all dates to YYYY-MM-DD format.
    3. Ensure all numeric values are returned as numbers, NOT strings.
    4. Search the entire document for bank details (payment_account) and contact info.
    5. Return ONLY the JSON object. Do not include any preamble, markdown blocks, or explanation.
  `;

  try {
    let result;
    if (isFile) {
      const part = {
        inlineData: {
          data: input.split(',')[1] || input,
          mimeType: "application/pdf"
        }
      };
      result = await model.generateContent([prompt, part]);
    } else {
      result = await model.generateContent([prompt, input]);
    }

    const response = await result.response;
    const text = response.text();
    console.log("Gemini Raw Response:", text);
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Gemini did not return a valid JSON object.");
    }
    
    const cleanJson = jsonMatch[0];
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("AI Parsing Error Details:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response as JSON. The data might be malformed.");
    }
    throw new Error(error.message || "Failed to parse invoice data with AI.");
  }
};
