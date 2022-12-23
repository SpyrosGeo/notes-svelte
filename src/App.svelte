<script lang="ts">
import {onMount} from "svelte";

import Login from "./lib/Login.svelte";
import Messages from "./lib/Messages.svelte";
import { currentUser } from "./lib/pocketbase";


let showAlert:boolean = false
let proTips = [
"Oi simeioseis kai oi gunaikes theloun xeri",
"Oi gunaikes einai pio duskolo na simeiosoun giati to stilo den pianei kala sta plumena piata",
"Mia omorfi gunaika simeionei, mia asximi moutzouronei"
]
const getProTip = ()=>{
return proTips[Math.floor(Math.random()*proTips.length)]
}
let proTip:string ;
const showInfo= ()=>{
showAlert = true
proTip = getProTip()
}
onMount(async()=>{
proTip = ''
showAlert= false;
})

</script>

<div class="h-100 d-flex justify-content-center align-items-center">
  <div>
    <div class="row d-flex align-items-center">

    <img on:click="{showInfo}" on:keydown="{showInfo}" class="col col-2" src="logo.png" alt="">
    <h1 class=" col col-10">
      {$currentUser?.name
        ? "Hello " + $currentUser.name
        : "Login or Sign Up Dude..."}
    </h1>
    </div>
    <Login />
    {#if $currentUser}
      <Messages />
    {/if}
  </div>
  
</div>
{#if showAlert }
    
  <div class=" row alert alert-success d-flex"> 
    <span class="col col-12 text-center">{proTip}</span>   
  </div>
  {/if}
