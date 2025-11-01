import {create} from 'zustand'

export const useStore = create((set) => ({
    mobileData: null,
    setMobileData: (data) => set({ mobileData: data }),
    hookPosition: null,
    setHookPosition: (data) => set({ hookPosition: data }),
    renderTexture: null,
    setRenderTargetTexture: (data) => set({ renderTexture: data })
}))