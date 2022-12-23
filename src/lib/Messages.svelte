<script lang="ts">
  import type {UnsubscribeFunc} from "pocketbase";

import { onMount,onDestroy } from "svelte";
import { currentUser,pb } from "./pocketbase";

let newMessage:string;
let messages:any = [];
let unsubscribe:()=>Promise<UnsubscribeFunc>
onMount(async()=>{
  const resultList = await pb.collection('messages').getList(1,50,{
sort:'created',
expand:'user',
});
messages = resultList.items
  pb.collection('messages').subscribe('*',async({action,record})=>{
  if(action==='create'){
    const user = await pb.collection('users').getOne(record.user)
    messages = [...messages,record]
  }
  if(action==='delete'){
    messages = messages.filter(message => message.id!== record.id)
  }

console.log('currentUser',$currentUser.id)
})
})

async function sendMessage(){
const data = {
text:newMessage,
user:$currentUser.id
}
const createdMessage = await pb.collection('messages').create(data)
newMessage =''
}

console.log('currentUser',$currentUser.id)
</script>

<div class="messages">
  {#each messages as message (message.id) }
    <div class="msg">
        <img src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`} alt="" class="avatar" width="40px">
    </div>
    <small>
      Sent by @{message.expand?.user?.username}
    </small>
    <p class="msg-text">{message.text}</p>
  {/each}

</div>
<form on:submit|preventDefault={sendMessage}>
  <input placeholder="message" bind:value={newMessage} type="text"/>
  <button type="submit">Send</button>
</form>
