import pocketbase from "pocketbase";
import { writable } from "svelte/store";
export const pb = new pocketbase('http://192.168.8.35:8090/')


export const currentUser = writable(pb.authStore.model)

pb.authStore.onChange((auth)=>{
  currentUser.set(pb.authStore.model)
})
