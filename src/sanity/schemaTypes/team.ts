import {defineType, defineField} from "sanity";

export const teamSchema = defineType({
  name: "teamSection",
  title: "Team Section",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description:
        "Add the priority of the member to make his placement among team members (Lower Number = Higher Priority)",
    }),
    defineField({
      name: "img",
      title: "Image",
      type: "image",
      description: "Upload the member's image (use optimized webp if possible)",
      options: {hotspot: true},
    }),

    defineField({
      name: "linkedin",
      title: "LinkedIn Profile",
      type: "url",
      validation: (Rule) => Rule.uri({scheme: ["https"]}),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "img",
    },
  },
});
