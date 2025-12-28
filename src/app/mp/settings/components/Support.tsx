"use client";
// ----------------------
// Imports
// ----------------------
import {useState} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {SupportType} from "@/types";
import {supportHandler} from "../../mpHandler/safr";

// ----------------------
// Validation schema for user support form
// ----------------------
const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description is required"),
});

// ----------------------
// User support component
// ----------------------
const SupportForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const initialValues = {
    category: "",
    subject: "",
    description: "",
  };

  // ----------------------
  // Submitting user's support form
  // ----------------------
  const handleSubmit = async (values: SupportType) => {
    try {
      const res = await supportHandler(values);
      setMessage(res?.message);
      setLoading(false);
    } catch (error: any) {
      setError(error?.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mt-20">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({isSubmitting}) => (
            <Form className="space-y-4">
              <div className="mb-10">
                <label
                  htmlFor="category"
                  className="m-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </label>
                <div className="m-4">
                  <Field
                    as="select"
                    name="category"
                    id="category"
                    className="w-full md:w-96 bg-transparent border border-dark-logo-primary text-dark-custom-dark-blue dark:text-light-light-white rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-dark-logo-primary"
                  >
                    <option
                      className="bg-light-light-white dark:bg-dark-custom-dark-blue"
                      value=""
                      disabled
                    >
                      Select a category
                    </option>
                    <option
                      className="bg-light-light-white dark:bg-dark-custom-dark-blue"
                      value="feature"
                    >
                      Feature Request
                    </option>
                    <option
                      className="bg-light-light-white dark:bg-dark-custom-dark-blue"
                      value="support"
                    >
                      Feedback/Bug Report
                    </option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="m-4">
                <Field
                  type="subject"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  className="reglo-input-field md:w-96 border border-slate-200 dark:border-dark-button-blue px-2 text-dark-custom-dark-blue dark:text-light-light-white"
                />
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="m-4">
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="reglo-input-field xl:w-[50rem] resize-none border border-slate-200 dark:border-dark-button-blue px-2 text-dark-custom-dark-blue dark:text-light-light-white"
                  placeholder="Description"
                  rows={4}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-40 sm:ml-4 bg-blue-600 text-white py-2 rounded-md transition duration-300 ${loading && "bg-gray-500"}`}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </Form>
          )}
        </Formik>
        {message != undefined && (
          <div className="bg-dark-logo-primary text-white text-center my-5 p-2">
            <p>{message}</p>
          </div>
        )}
        {error != undefined && (
          <div className="bg-red-500 text-white text-center my-5 p-2">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
};
export default SupportForm;
