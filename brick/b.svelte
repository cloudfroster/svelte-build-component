<div>hello B</div>
<C></C>

<script>
import C from './c.svelte'
import { onMount } from 'svelte'

onMount(() => {
  console.log('mount app B')
})
</script>