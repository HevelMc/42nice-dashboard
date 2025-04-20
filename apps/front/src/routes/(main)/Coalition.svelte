<script lang="ts" module>
  export interface CoalitionItem {
    id: number;
    name: string;
    score: number;
    bg: string;
    color: string;
    medal: string;
    logo: string;
    topUser: {
      login: string;
      image_url: string;
    };
  }
</script>

<script lang="ts">
  import { mode } from 'mode-watcher';

  const { coalition }: { coalition: CoalitionItem } = $props();

  const backdrop = $derived($mode === 'dark' ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.1)');
</script>

<div
  class="my-auto h-fit w-[360px] rounded-xl bg-cover pb-8 pt-4 shadow-xl"
  style="background-image: linear-gradient({backdrop}, {backdrop}), url('{coalition.bg}')"
>
  <img src={'/' + coalition.medal} alt="medal" class="mx-auto my-5 h-auto w-[60px]" />
  <img src={coalition.logo} alt="logo" class="mx-auto h-auto w-[160px]" />
  <h1 class="my-2 text-center text-[35px] font-bold uppercase" style="color: {coalition.color}">{coalition.name}</h1>
  <div class="mb-8 flex justify-center gap-2">
    <img src="/trophy.svg" alt="trophy" class="h-auto w-[30px]" />
    <h1 class="font text-[35px] text-white">{Intl.NumberFormat('fr').format(coalition.score)}</h1>
  </div>
  <div class="flex flex-col items-center gap-2">
    <p class="font pb-1 text-xl font-light text-white" style="color: {coalition.color}">TOP SCORER</p>
    <img src={coalition.topUser.image_url} alt="top scorer" class="mx-auto h-20 w-20 rounded-full object-cover" />
    <p class="font text-2xl font-bold text-white" style="color: {coalition.color}">{coalition.topUser.login}</p>
  </div>
</div>
