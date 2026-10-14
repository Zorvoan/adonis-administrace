import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

export default {
  tables: {
    users: {
      columns: {
        role: {
          tsType: `'admin' | 'user'`,
          decorators: [{ name: '@column' }],
        },
      },
    },
  },
} satisfies SchemaRules
