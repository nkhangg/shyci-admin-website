export const constants = {
    defaultAdminName: 'admin',

    imageDisplayWhenErorr:
        'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',

    sizes: [
        { id: 'S', name: 'S' },
        { id: 'M', name: 'M' },
        { id: 'L', name: 'L' },
        { id: 'XL', name: 'XL' },
        { id: '2XL', name: '2XL' },
    ],
    sorts: [
        {
            id: 'latest',
            name: 'Mới nhất',
        },
        {
            id: 'oldnest',
            name: 'Cũ nhất',
        },
    ],

    statusMap: {
        pending: { label: 'Pending', color: 'warning' },
        delivered: { label: 'Delivered', color: 'success' },
        refunded: { label: 'Refunded', color: 'error' },
    },
    rolesMap: {
        create: { label: 'Create', color: 'primary' },
        edit: { label: 'Edit', color: 'warning' },
        delete: { label: 'Delete', color: 'error' },
        read: { label: 'Read', color: 'success' },
        root: { label: 'Root', color: 'default' },
    },

    roles: ['create', 'edit', 'delete', 'read', 'root'],
};
