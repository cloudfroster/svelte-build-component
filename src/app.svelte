<div>hello</div>
<E></E>
<B></B>
<div bind:this={ref}></div>

<script>
// use build component
import E from './e.svelte'
import B from '../dist/brick.browser.js'
import { onMount } from 'svelte'
let ref

onMount(() => {
  console.log(ref)
  console.log('mount app')
})
</script>