import { TextInput } from "@mantine/core";
import Heading from "../common/Heading";
import useInputChange from "../hooks/useInputChange";
import { ChangeEvent, useContext } from "react";
import AppContext from "../context/AppContext";
import useValidation from "../hooks/useValidation";
import Footer from "../common/Footer";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  faxNumber: string;
}

const FaxNumber = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext) as {
    formData: FormData;
    setStep: (step: number) => void;
  };

  const validationRules = {
    faxNumber: {
      required: true,
      message: "Enter a valid fax number.",
      pattern: {
        value: /^\d{10}$/, // Ensures exactly 10 digits
        message: "Fax number must be 10 digits.",
      },
      validate: (value: string) => {
        const plainNumber = value.replace(/\D/g, ""); // Extract only digits
        if (!plainNumber) return "Fax number is required."; // Explicitly check empty input
        return plainNumber.length === 10 || "Fax number must be 10 digits.";
      },
    },
  };

  const { errors, validateFields, clearError } = useValidation(validationRules);

  const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10); // Limit to 10 digits

    if (cleaned.length >= 7) {
      return `(${cleaned.slice(0, 3)})-${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    } else if (cleaned.length >= 4) {
      return `(${cleaned.slice(0, 3)})-${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      return `(${cleaned}`;
    }
    return "";
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    handleInputChange("faxNumber", formattedNumber);
    clearError("faxNumber"); // Clear error on change
  };

  const handleNextStep = () => {
    // Extract only numeric characters for validation
    const rawPhone = formData?.faxNumber?.replace(/\D/g, "");

    const isValid = validateFields({ ...formData, faxNumber: rawPhone }); // Validate first

    if (isValid) {
      setStep(4);
    }
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Fax Number" />
        <div className="mb-5">
          <TextInput
            type="text"
            value={formData.faxNumber || ""}
            error={errors?.faxNumber || null} // Show error message
            maxLength={14} // Prevents exceeding formatted length
            onChange={handlePhoneChange}
            placeholder="(XXX)-XXX-XXXX"
          />
        </div>
      </div>
      <Footer
        handleNextStep={handleNextStep}
        handlePreviousStep={() => setStep(2)}
      />
    </div>
  );
};

export default FaxNumber;
