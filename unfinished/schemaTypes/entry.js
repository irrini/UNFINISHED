export default {
    name: 'entry',
    title: 'Entry',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },        
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {source: 'title',}, validation: (Rule) => Rule.required(),
        },
        {
            name: 'entrynumber',
            title: 'Entry Number',
            type: 'number',
        },
        {
            name: 'city',
            title: 'City',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'location',
            title: 'Location',
            type: 'geopoint'
        },
        {
            name: 'mapslink',
            title: 'Google Maps Link',
            type: 'url'
        },
        {
            name: 'typology',
            title: 'Building Typology',
            type: 'string',
        },
        {
            name: 'year',
            title: 'Year',
            type: 'number',
        },
        {
            name: 'area',
            title: 'Site area',
            type: 'number',
        },
        {
            name: 'floors',
            title: 'Floors',
            type: 'number',
        },
        {
            name: 'material',
            title: 'Structural Material',
            type: 'string',
        },
        {
            name: 'otherinfo',
            title: 'Other Information',
            type: 'array', of: [{type: 'block'}],
        },
        {
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
        },
        {
            name: 'images',
            title: 'Images',
            type: 'array', of: [{type: 'image'}], options: {sortable: 'true'},
        }
    
    ]

}