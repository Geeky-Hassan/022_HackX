"use client";

import {useState} from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import StoryForm from "../Forms/Story-Form";
import EducationForm from "../Forms/Education-Form";

const validationSchema = [
  Yup.object({
    story: Yup.string()
      .required("Please tell us your story")
      .min(30, "Your story must be at least 30 characters")
      .max(255, "Your story can't be more than 255 characters"),
  }),
  Yup.object({
    education: Yup.array().of(
      Yup.object({
        institution: Yup.string(),
        degree: Yup.string(),
        fieldOfStudy: Yup.string(),
        startYear: Yup.string(),
        endYear: Yup.string()
          .test(
            "is-valid-end-year",
            "End year must be 'Present' or a valid year",
            (value?: string) => {
              if (!value) return true; // Allow empty if optional
              return value === "Present" || /^\d{4}$/.test(value);
            },
          )
          .test("is-after-start-year", "End year must be after start year", function (value) {
            const {startYear} = this.parent;
            if (value === "Present" || !startYear || !value) return true;
            return Number.parseInt(value) >= Number.parseInt(startYear);
          }),
      }),
    ),
  }),
];

const NewUserModal = ({checkNewUser}: {checkNewUser: any}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e17] text-gray-900 dark:text-white p-2 sm:p-6 flex flex-col justify-center w-full max-w-xl mx-auto">
      <Formik
        initialValues={{
          story: "",
          education: [
            {
              institution: "",
              degree: "",
              fieldOfStudy: "",
              startYear: "",
              endYear: "",
            },
          ],
        }}
        validationSchema={validationSchema[step]}
        onSubmit={async (values) => {
          if (step < 1) {
            nextStep();
            return;
          }

          setLoading(true);
          checkNewUser(false);
          try {
            // Final submit logic
          } finally {
            setLoading(false);
          }
        }}
      >
        {(formik) => (
          <Form className="space-y-6">
            {step === 0 ? (
              <StoryForm formik={formik} loading={loading} />
            ) : (
              <EducationForm
                formik={formik}
                prevStep={prevStep}
                loading={loading}
                checkNewUser={checkNewUser}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default NewUserModal;
