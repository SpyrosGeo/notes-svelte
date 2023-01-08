import pocketbase from "pocketbase";
import { writable } from "svelte/store";
export const pb = new pocketbase('https://notes-api.thatguy.gr/')


export const currentUser = writable(pb.authStore.model)

pb.authStore.onChange((auth)=>{
  currentUser.set(pb.authStore.model)
})
