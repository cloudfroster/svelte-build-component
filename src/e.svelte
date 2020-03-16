<div>hello E</div>
<F></F>
<script>
import F from './f.svelte'
import { onMount } from 'svelte'

onMount(() => {
  console.log('mount app E')
})
</script>