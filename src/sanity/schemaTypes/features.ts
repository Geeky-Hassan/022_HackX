import {defineField, defineType} from "sanity";

export const featureSchema = defineType({
  name: "featureSchema",
  title: "Feature",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file", // using file instead of image
      options: {
        accept: "video/mp4, video/webm", // restrict to video formats
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "video", // still works, will show video thumbnail
    },
  },
});
