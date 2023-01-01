<script lang="ts">

import { onMount, onDestroy } from "svelte";
import { currentUser, pb } from "./pocketbase";
let newMessage: string;

export let messages: any[] = [];
onMount(async () => {
  const resultList = await pb.collection("messages").getList(1, 50, {
    sort: "created",
    expand: "user",
  });
  messages = resultList.items
    .filter((item) => item?.user === $currentUser?.id)
    .map((item) => item);
});

async function sendMessage() {
  const data = {
    text: newMessage,
    user: $currentUser.id,
  };
  const createdMessage = await pb.collection("messages").create(data);
  messages = [...messages, createdMessage];
  newMessage = "";
}
</script>

<div class="container ">
  <div class="row h-100 w-100 ">   {#each messages as message (message.id)}
    <div class='msg-text col col-4 d-flex  my-1'>
    <p class="  p-2 ">{message.text}</p>
    </div>
  {/each}
</div>
<div class="row">
<form  class="container d-flex flex-column"on:submit|preventDefault="{sendMessage}">
  <div class="col col-12 mb-3">
  <textarea class="w-100 h-100"  placeholder="message" bind:value="{newMessage}" type="text"
  ></textarea>
</div>
  <button class="btn btn-dark" type="submit">Save</button>

</form> 
  </div>
  </div>

  <style>
  .msg-text{
    border:3px solid black;
    border-radius:2rem;
  }
  .boxsizingBorder {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}
  </style>

