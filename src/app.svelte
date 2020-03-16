<div>hello</div>
<E></E>
<B></B>

<script>
// use build component
import B from '../dist/brick.browser.mjs'
import E from './e.svelte'
import { onMount } from 'svelte'

onMount(() => {
  console.log('mount app')
})
</script>