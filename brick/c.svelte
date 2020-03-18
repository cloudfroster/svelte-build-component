<div ref>hello C</div>
<script>
import { onMount } from 'svelte'
let ref
onMount(() => {
  let ref
  console.log(ref)
  console.log('mount app C')
})
</script>