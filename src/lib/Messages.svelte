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
console.log('messages',messages)
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
async function removeMessage(messageId){
 console.log('Message:',messageId)
messages = messages.filter((message)=>message.id!==messageId)
await pb.collection('messages').delete(messageId)
}
async  function handleClick(e,messageId){
if(e.altKey){
removeMessage(messageId)
}else{
let text = e.target.innerHTML
try{
 await navigator.clipboard.writeText(text)
}catch{

}
}
}
function formatDate(date){
return date.split(' ')[0]

}
</script>
{#if !messages.length}
 <p>No messages</p> 
{/if}
  <div class="row message--list__container mb-2">
  <div class="  w-100 message-list__height ">   {#each messages as message (message.id)}
    <div  on:click="{(e)=>handleClick(e,message.id)}" class='col col-12 msg-container  d-flex  my-1 '>
    <p class=" msg-text col col-3">{message.text}</p>
    <span class=" msg-date col col-9">{formatDate(message.created)}</span>
    </div>
  {/each}
</div>
</div>
<div class="row">
<form  class="col col-12 d-flex flex-column"on:submit|preventDefault="{sendMessage}">
  <div class="col col-12 mb-3">
  <textarea class="w-100 h-100"  placeholder="Add a note!" bind:value="{newMessage}" type="text"
  ></textarea>
</div>
  <button class="btn btn-dark" type="submit">Save</button>

</form> 
  </div>

  <style>
  .message--list__container {
    height:30rem;
    overflow-y: auto;
  }
  .message--list__height{
    height: 44rem;
    border:1px solid black;
  }
  .msg-container{
    border-bottom: 2px solid black;
    cursor: pointer;
  }
  .msg-text {
    font-size:1.79rem;
  }
  .msg-date{
    font-size:0.8rem;
  }
  .boxsizingBorder {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}
  </style>

