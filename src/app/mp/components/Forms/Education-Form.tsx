"use client";

import {FieldArray, ErrorMessage, type FormikProps} from "formik";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  School,
  Calendar,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {useState} from "react";
import "react-datepicker/dist/react-datepicker.css";

interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

interface FormValues {
  story: string;
  education: EducationEntry[];
}

interface EducationFormProps {
  formik: FormikProps<FormValues>;
  prevStep: () => void;
  loading: boolean;
  checkNewUser: (value: boolean) => void;
}

const universityOptions = [
  {label: "Harvard University", value: "Harvard University"},
  {label: "MIT", value: "MIT"},
  {label: "Stanford University", value: "Stanford University"},
  {label: "Other", value: "other"},
];

const degreeOptions = [
  {label: "Bachelor's", value: "Bachelor's"},
  {label: "Master's", value: "Master's"},
  {label: "PhD", value: "PhD"},
  {label: "Other", value: "other"},
];

const fieldOptions = [
  {label: "Computer Science", value: "Computer Science"},
  {label: "Engineering", value: "Engineering"},
  {label: "Business", value: "Business"},
  {label: "Other", value: "other"},
];

const tailwindSelectClasses = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
    padding: "0.25rem",
    borderRadius: "0.5rem",
    minHeight: "2.5rem",
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 10,
    borderRadius: "0.5rem",
    backgroundColor: "white",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#f3f4f6" : "transparent",
    color: state.isSelected ? "white" : "#111827",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#111827",
  }),
  input: (base: any) => ({
    ...base,
    color: "#111827",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
  }),
};

const darkTailwindSelectClasses = {
  ...tailwindSelectClasses,
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#3b82f6" : "#4b5563",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
    padding: "0.25rem",
    borderRadius: "0.5rem",
    minHeight: "2.5rem",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#1f2937",
    color: "#f9fafb",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#374151" : "transparent",
    color: state.isSelected ? "white" : "#f9fafb",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#f9fafb",
  }),
  input: (base: any) => ({
    ...base,
    color: "#f9fafb",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
  }),
};
const optionalLabelStyles = {
  wrapper: "inline-flex items-center gap-2 mb-4 mt-2",
  badge:
    "px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600",
  text: "text-sm text-blue-500 dark:text-blue-400 font-normal",
};

const isDarkMode = () => window.matchMedia?.("(prefers-color-scheme: light)").matches;

const EducationForm = ({formik, prevStep, loading}: EducationFormProps) => {
  const [customInputs, setCustomInputs] = useState<{
    [key: number]: {institution?: string; degree?: string; fieldOfStudy?: string};
  }>({});

  const selectStyles = isDarkMode() ? darkTailwindSelectClasses : tailwindSelectClasses;

  return (
    <div className="space-y-8 text-gray-900 my-20 dark:text-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-300" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Education</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Tell us about your educational background to help us understand your qualifications
        </p>
        <div className={optionalLabelStyles.wrapper}>
          <span className={optionalLabelStyles.badge}>Optional</span>
          <span className={optionalLabelStyles.text}>You may leave this section blank!</span>
        </div>
      </div>

      <FieldArray name="education">
        {({remove, push}) => (
          <div className="space-y-6">
            {formik.values.education.map((edu, index) => (
              <div
                key={index}
                className="p-2 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm space-y-6 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4 mb-2">
                  <h3 className="font-semibold text-lg flex items-center">
                    <School className="h-5 w-5 mr-2 text-blue-500" />
                    Education #{index + 1}
                  </h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Remove education entry"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Institution Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <School className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Institution
                  </label>
                  <Select
                    options={universityOptions}
                    placeholder="Select or type your institution"
                    onChange={(option) => {
                      if (option?.value === "other") {
                        setCustomInputs((prev) => ({
                          ...prev,
                          [index]: {...prev[index], institution: ""},
                        }));
                        formik.setFieldValue(`education.${index}.institution`, "");
                      } else {
                        formik.setFieldValue(`education.${index}.institution`, option?.value);
                        setCustomInputs((prev) => {
                          const updated = {...prev};
                          delete updated[index]?.institution;
                          return updated;
                        });
                      }
                    }}
                    onInputChange={(inputValue) => {
                      const current = formik.values.education[index].institution;
                      if (current === "") {
                        formik.setFieldValue(`education.${index}.institution`, inputValue);
                      }
                    }}
                    defaultValue={
                      universityOptions.find((opt) => opt.value === edu.institution) || null
                    }
                    styles={selectStyles}
                    className="text-sm"
                  />
                  {customInputs[index]?.institution !== undefined && (
                    <input
                      type="text"
                      placeholder="Your institution"
                      className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      value={edu.institution}
                      onChange={(e) =>
                        formik.setFieldValue(`education.${index}.institution`, e.target.value)
                      }
                    />
                  )}
                  <ErrorMessage name={`education.${index}.institution`}>
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Degree Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Degree
                  </label>
                  <Select
                    options={degreeOptions}
                    placeholder="Select or type your Degree"
                    onChange={(option) => {
                      if (option?.value === "other") {
                        setCustomInputs((prev) => ({
                          ...prev,
                          [index]: {...prev[index], degree: ""},
                        }));
                        formik.setFieldValue(`education.${index}.degree`, "");
                      } else {
                        formik.setFieldValue(`education.${index}.degree`, option?.value);
                        setCustomInputs((prev) => {
                          const updated = {...prev};
                          delete updated[index]?.degree;
                          return updated;
                        });
                      }
                    }}
                    onInputChange={(inputValue) => {
                      const current = formik.values.education[index].degree;
                      if (current === "") {
                        formik.setFieldValue(`education.${index}.degree`, inputValue);
                      }
                    }}
                    defaultValue={degreeOptions.find((opt) => opt.value === edu.degree) || null}
                    styles={selectStyles}
                    className="text-sm"
                  />
                  {customInputs[index]?.degree !== undefined && (
                    <input
                      type="text"
                      placeholder="Your Degree"
                      className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      value={edu.degree}
                      onChange={(e) =>
                        formik.setFieldValue(`education.${index}.degree`, e.target.value)
                      }
                    />
                  )}
                  <ErrorMessage name={`education.${index}.degree`}>
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Field of Study Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Field of Study
                  </label>
                  <Select
                    options={fieldOptions}
                    placeholder="Select or type your field"
                    onChange={(option) => {
                      if (option?.value === "other") {
                        setCustomInputs((prev) => ({
                          ...prev,
                          [index]: {...prev[index], fieldOfStudy: ""},
                        }));
                        formik.setFieldValue(`education.${index}.fieldOfStudy`, "");
                      } else {
                        formik.setFieldValue(`education.${index}.fieldOfStudy`, option?.value);
                        setCustomInputs((prev) => {
                          const updated = {...prev};
                          delete updated[index]?.fieldOfStudy;
                          return updated;
                        });
                      }
                    }}
                    onInputChange={(inputValue) => {
                      const current = formik.values.education[index].fieldOfStudy;
                      if (current === "") {
                        formik.setFieldValue(`education.${index}.fieldOfStudy`, inputValue);
                      }
                    }}
                    defaultValue={
                      fieldOptions.find((opt) => opt.value === edu.fieldOfStudy) || null
                    }
                    styles={selectStyles}
                    className="text-sm"
                  />
                  {customInputs[index]?.fieldOfStudy !== undefined && (
                    <input
                      type="text"
                      placeholder="Your field"
                      className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        formik.setFieldValue(`education.${index}.fieldOfStudy`, e.target.value)
                      }
                    />
                  )}
                  <ErrorMessage name={`education.${index}.fieldOfStudy`}>
                    {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Start / End Year Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Start Year
                    </label>
                    <DatePicker
                      selected={edu.startYear ? new Date(edu.startYear) : null}
                      onChange={(date: Date | null) => {
                        formik.setFieldValue(
                          `education.${index}.startYear`,
                          date?.toISOString() || "",
                        );
                      }}
                      showYearPicker
                      dateFormat="yyyy"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholderText="Select year"
                      wrapperClassName="w-full"
                    />
                    <ErrorMessage name={`education.${index}.startYear`}>
                      {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      End Year
                    </label>
                    <DatePicker
                      selected={
                        edu.endYear && edu.endYear !== "Present" ? new Date(edu.endYear) : null
                      }
                      onChange={(date: Date | null) => {
                        formik.setFieldValue(
                          `education.${index}.endYear`,
                          date?.toISOString() || "",
                        );
                      }}
                      showYearPicker
                      dateFormat="yyyy"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholderText="Select year or choose Present"
                      wrapperClassName="w-full"
                    />
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue(`education.${index}.endYear`, "Present")}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
                    >
                      <div className="w-4 h-4 mr-1 border border-blue-500 rounded-full flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${edu.endYear === "Present" ? "bg-blue-500" : ""}`}
                        ></div>
                      </div>
                      Currently studying
                    </button>
                    <ErrorMessage name={`education.${index}.endYear`}>
                      {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                    </ErrorMessage>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                push({institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: ""})
              }
              className="w-full flex items-center justify-center py-4 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Add Another Education</span>
              </div>
            </button>
          </div>
        )}
      </FieldArray>

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-xs sm:text-base">
        <button
          type="button"
          onClick={prevStep}
          className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg flex items-center transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Bio
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
