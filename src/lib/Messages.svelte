<style>
.message--list__container {
  height: 25rem;
  width: 30rem;
  overflow-y: auto;
}
.message--list__height {
  height: 44rem;
  border: 1px solid black;
}
.msg-container {
  border-bottom: 2px solid black;
}
.msg-text {
  cursor: pointer;
  font-size: 1.08rem;
}
.msg-date {
  font-size: 0.6rem;
}
  .msg-delete{
    font-size:0.9rem;
    padding:2px 10px;
  }
.boxsizingBorder {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
</style>

<script lang="ts">
import { onMount, onDestroy } from "svelte";
import { currentUser, pb } from "./pocketbase";
let newMessage: string;
export let alertMessage: string = "";
export let isAlertWarning: boolean = false;
export let showAlert: boolean = false;
export let messages: any[] = [];
onMount(async () => {
  const resultList = await pb.collection("messages").getList(1, 50, {
    sort: "created",
    expand: "user",
  });
  messages = resultList.items
    .filter((item) => item?.user === $currentUser?.id)
    .map((item) => item);
  console.log("messages", messages);
});

async function sendMessage() {
  if (!newMessage.length) return;
  const data = {
    text: newMessage,
    user: $currentUser.id,
  };
  const createdMessage = await pb.collection("messages").create(data);
  messages = [...messages, createdMessage];
  newMessage = "";
}
async function removeMessage(messageId) {
  console.log("Message:", messageId);
  messages = messages.filter((message) => message.id !== messageId);
  await pb.collection("messages").delete(messageId);
}
async function handleClick(e, messageId) {
  if (e.altKey) {
    removeMessage(messageId);
  } else {
    let text = e.target.innerHTML;
    try {
      await navigator.clipboard.writeText(text);
      alertMessage = `Copied to Clipboard`;
      showAlert = true;
      isAlertWarning = false;
      setTimeout(() => {
        alertMessage = "";
        showAlert = false;
      }, 1000);
    } catch {
      alertMessage = `Something went wrong`;
showAlert = true;
      isAlertWarning = true;
      setTimeout(() => {
        alertMessage = "";
        showAlert = false;
      }, 1000);
    }
  }
}

function formatDate(date: string) {
  return date.split(" ")[0];
}
</script>

{#if !messages.length}
  <p>No Notes</p>
{/if}
<div class=" row message--list__container mb-2 w-100">
  <div class="container ">
    {#each messages as message (message.id)}
      <div class="col col-12 msg-container  d-flex align-items-center my-2  ">
        <div class="col col-10">
          <p
            on:click="{(e) => handleClick(e, message.id)}"
            on:keydown="{(e) => handleClick(e, message.id)}"
            class=" msg-text ">
            {message.text}
          </p>
        </div>
        <div class=" col col-2 d-flex justify-content-around align-items-center">
          <span class=" msg-date ">{formatDate(message.created)}</span>
          <button on:click={(()=>removeMessage(message.id))} class=" btn  btn-danger msg-delete">x</button>
        </div>
      </div>
    {/each}
  </div>
</div>
<div class="row w-100">
  <form
    class="col col-12 d-flex flex-column"
    on:submit|preventDefault="{sendMessage}">
    <div class="col col-12 mb-3">
      <textarea
        class="w-100 h-100"
        maxlength="35"
        placeholder="Add a note!"
        bind:value="{newMessage}"
        type="text"></textarea>
    </div>
    <button class="btn btn-dark" type="submit">Save</button>
  </form>
</div>
