<script lang="ts">
 import { currentUser, pb} from "./pocketbase";
  let username:string;
  let password:string;

  async function login(){
    await pb.collection('users').authWithPassword(username,password)
  }
async function signup(){
try{
const data = {
username,
password,
passwordConfirm:password,
name:'thatguy2'
}
const  createdUser = await pb.collection('users').create(data);
await login();
}catch(err){
console.log('error',err)
}
}
function signOut(){
pb.authStore.clear()
}
</script>


{#if $currentUser}
  <button on:click={signOut}>Log out</button>
  <p>Signed in as {$currentUser.username}</p>
{:else}
  <form on:submit|preventDefault action="">
    <input placeholder="Username" bind:value={username}/>
    <input placeholder="Password" bind:value={password}  type="password"/>

    <button on:click={signup}>Sign Up</button>
    <button on:click={login}>Login</button>

  </form>
{/if}


