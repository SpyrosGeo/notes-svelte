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

<div class="container messages col col-12">
  {#each messages as message (message.id)}
    <div class="msg"></div>
    <p class="msg-text">{message.text}</p>
  {/each}
</div>
<form on:submit|preventDefault="{sendMessage}">
  <textarea placeholder="message" bind:value="{newMessage}" type="text"
  ></textarea>
  <button class="btn btn-dark" type="submit">Send</button>

</form>
