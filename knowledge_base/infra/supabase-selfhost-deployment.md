# Self-hosted Supabase Function Deployment

## Context
- The project uses a self-hosted Supabase stack accessible on the internal network at `10.0.1.14`.
- The CLI command `supabase functions deploy` is not supported in this environment and **must not be used** going forward.

## Deployment Workflow
1. Package updates locally under `supabase/functions/`.
2. Use `rsync` over SSH to copy the function directories to the server path `/home/ubuntu/eco-quest-backend/supabase/functions`.
   - Example command:
     ```bash
     rsync -az --delete -e "ssh -i ~/.ssh/eco-quest-supabase" supabase/functions/ ubuntu@10.0.1.14:/home/ubuntu/eco-quest-backend/supabase/functions/
     ```
3. Ensure permissions on the target machine allow Supabase Edge Runtime to pick up the updated code.
4. Restart or reload the Supabase functions service if required by the host setup.

## SSH Guidance
- Maintain a dedicated SSH key pair for deployment (stored under `.ssh/eco-quest-supabase`).
- Keep the private key only on trusted CI/automation nodes; share the public key with the target host.
- Update this document if the host IP, SSH user, or directory structure changes.

## Pending Tasks
- Automate rsync deployment once CI credentials are finalized.
- Document service restart commands for the Supabase host.
