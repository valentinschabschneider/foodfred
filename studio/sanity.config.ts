import {dashboardTool} from '@sanity/dashboard'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {netlifyWidget} from 'sanity-plugin-dashboard-widget-netlify'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
export const dataset = process.env.SANITY_STUDIO_DATASET!

export default defineConfig({
  name: 'project-name',
  title: 'FoodFred',
  projectId,
  dataset,
  plugins: [
    deskTool(),
    visionTool(),
    dashboardTool({
      widgets: [
        netlifyWidget({
          title: 'My Netlify deploys',
          sites: [
            {
              title: 'FoodFred',
              apiId: '8983502c-4823-401c-9204-1fd258e72d9a',
              buildHookId: '64da7a4be3b0b4006ce5fd40',
              name: 'foodfred',
              url: 'https://foodfred.app',
            },
          ],
        }),
      ],
    }),
    // documentInternationalization({
    //   // Required configuration
    //   supportedLanguages: [
    //     {id: 'es', title: 'Spanish'},
    //     {id: 'en', title: 'English'},
    //   ],
    //   schemaTypes: ['post'],
    //   weakReferences: true, // defaults to false
    //   metadataFields: [defineField({name: 'slug', type: 'slug'})],
    // }),
    // googleTranslate(),
  ],
  schema: {
    types: schemaTypes,
  },
})
