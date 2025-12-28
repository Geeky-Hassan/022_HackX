"use client";

import type React from "react";

import {Field, ErrorMessage, type FormikProps} from "formik";
import {ChevronRight, BookOpen} from "lucide-react";
import {useState, useEffect} from "react";

interface StoryFormProps {
  formik: FormikProps<{
    story: string;
    education: {
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startYear: string;
      endYear: string;
    }[];
  }>;
  loading: boolean;
}

export default function StoryForm({formik, loading}: StoryFormProps) {
  const [charCount, setCharCount] = useState(0);
  const minChars = 30;

  useEffect(() => {
    setCharCount(formik.values.story?.length || 0);
  }, [formik.values.story]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    formik.handleChange(e);
    setCharCount(e.target.value.length);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-300" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Tell us your story</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Write a brief description about yourself and your background
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <Field
            as="textarea"
            id="story"
            name="story"
            placeholder="I am a passionate professional with experience in..."
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
              formik.touched.story && formik.errors.story
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none transition-colors`}
            onChange={handleTextChange}
          />
          <div className="flex justify-between text-sm">
            <div
              className={charCount < minChars ? "text-red-500" : "text-gray-400 dark:text-gray-400"}
            >
              Minimum {minChars} characters
            </div>
            <div className="text-gray-500 dark:text-gray-400">{charCount} characters</div>
          </div>
          <ErrorMessage name="story">
            {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
          </ErrorMessage>
        </div>
      </div>

      <div className="flex justify-end">
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
              Loading...
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
