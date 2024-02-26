import Button from '../components/Button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],

}

export default meta

/*
 *👇 Render functions are a framework specific feature
 to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const ButtonStory = {
  args: { },
}
