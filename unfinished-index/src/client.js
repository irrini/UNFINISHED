import { createClient } from '@sanity/client'

const client = createClient ({
    projectId: 'uguf7zgz',
    dataset: 'production',
    apiVersion: '2025-03-15',
    useCdn: true,
})

export default client

