import {defineField, defineType} from "sanity";

export const timelineSchema = defineType({
  name: "timelineSchema",
  title: "Timeline Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Optional description",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Optional date",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      date: "date",
    },
    prepare(selection) {
      const {title, media, date} = selection;
      return {
        title: title,
        media: media,
        subtitle: date || "No date",
      };
    },
  },
});
