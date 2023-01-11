<script lang="ts">
import {onMount} from "svelte";

import Login from "./lib/Login.svelte";
import Messages from "./lib/Messages.svelte";
import { currentUser } from "./lib/pocketbase";


let isAlertWarning:boolean
let loginError:string
let showAlert:boolean = false
let alertMessage:string


onMount(async()=>{
showAlert= false;
})

</script>

<div class="container">
  <div class="d-flex flex-column">
    <div class="row d-flex align-items-center">

    <img  class="col col-2" src="logo.png" alt="">
    <h1 class=" col col-10">
      {$currentUser?.name
        ? "Hello " + $currentUser.name
        : "Login or Sign Up Dude..."}
    </h1>
    </div>
    <Login bind:loginError/>
    {#if $currentUser}
      <Messages bind:showAlert bind:alertMessage />
    {/if}
  </div>
  
</div>
{#if showAlert }
    
  <div class="row alert  d-flex {isAlertWarning ? 'alert-danger': 'alert-success'}" > 
    <span class="col col-12 text-center">{alertMessage}</span>   
  </div>
{/if}
{#if loginError?.length }
    
  <div class="row alert  d-flex  alert-danger" > 
    <span class="col col-12 text-center">{loginError}</span>   
  </div>
  {/if}
