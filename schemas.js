const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// we use this logic to prevent xss attacks
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
// this is where we implement new extension
const Joi = BaseJoi.extend(extension)

// Joi module is a popular module for data validation.
// This module validates the data based on schemas.
// There are various functions like optional(), required(), min(), max(), etc which make it easy to use and a user-friendly module for validating the data.
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    // this is where we use our extension .escapeHTML()
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
