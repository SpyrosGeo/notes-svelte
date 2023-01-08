<script lang="ts">
import { currentUser, pb } from "./pocketbase";
let username: string;
let password: string;
export let loginError:string;
async function login() {
  try{
  loginError = ''
   await pb.collection("users").authWithPassword(username, password);
  } catch(error){
  console.log('error',error)
    loginError = error.message 
  }
}
async function signup() {
  try {
    const data = {
      username,
      password,
      name:username,
      passwordConfirm: password,
    };
    const createdUser = await pb.collection("users").create(data);
    await login();
  } catch (error) {
    loginError=error?.message
  }
}
function signOut() {
  pb.authStore.clear();
}
</script>

{#if $currentUser}
  <div class="row">
  <div class="col col-4">
  <button class=" bnt btn-dark mb-3 " on:click="{signOut}">Log out</button>
  </div>
  <div class="col col-8">
    <p class="col col-12"> Delete: <span style="color:red;">"alt+click"</span> </p>
  </div>
  </div>
{:else}
  <form
    class="container d-flex flex-column justify-content-center"
    on:submit|preventDefault
    action=""
  >
    <div class=" row d-flex flex-column align-content-center ">
      <input
        class="col col-6 mt-2"
        placeholder="Username"
        bind:value="{username}"
      />
      <input
        class="col col-6 mt-2"
        placeholder="Password"
        bind:value="{password}"
        type="password"
      />
    </div>
    <br>
    <div class="row d-flex flex-column align-items-center mt-2">
      <button class=" col col-6 btn btn-dark mt-2" on:click="{signup}">Sign Up</button>
      <button class=" col col-6 btn btn-dark mt-2" on:click="{login}">Login</button>
    </div>
  </form>
{/if}
