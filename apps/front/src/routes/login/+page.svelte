<script>
  import { goto } from '$app/navigation';
  import { auth, login } from '$lib/auth';
  import { emailValid } from '$lib/utils';
  import { Button, Card, Input, Label } from 'hevel-ui';
  import { onMount } from 'svelte';

  let email = $state('');
  let password = $state('');

  let canSubmit = $derived(emailValid(email) && password.length > 0);

  onMount(() => {
    if ($auth?.user) {
      goto('/admin');
    }
  });
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <div class="absolute left-0 top-0 z-10 h-full w-full bg-background opacity-90"></div>
  <Card.Root class="relative z-20 mx-auto max-w-md border-border">
    <Card.Header>
      <Card.Title class="text-2xl">Connexion</Card.Title>
      <Card.Description>
        Bienvenue sur le panel d'administration de 42 Nice Dashboard. Veuillez vous connecter pour continuer.
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="hello@exemple.com" required bind:value={email} />
        </div>
        <div class="grid gap-2">
          <Label for="password">Mot de passe</Label>
          <Input id="password" type="password" required bind:value={password} />
        </div>
        <Button class="w-full" disabled={!canSubmit} onclick={() => login(email, password)}>Se connecter</Button>
      </div>
    </Card.Content>
  </Card.Root>
</div>
