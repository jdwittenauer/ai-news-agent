# Supabase

## Helpful Commands

Initialize project:
<pre>supabase init</pre>

Start the stack:
<pre>supabase start</pre>

Shut down the stack:
<pre>
supabase stop
docker ps --filter name=supabase -q | xargs docker stop
</pre>

Create initial migration file:
<pre>supabase db dump --local --file supabase/migrations/$(date +%Y%m%d%H%M%S)_init.sql</pre>

Create schema diff migration file:
<pre>supabase db diff --local --file supabase/migrations/$(date +%Y%m%d%H%M%S)_update.sql</pre>

Rebuild the database:
<pre>supabase db reset</pre>

## Project Services

<pre>
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
</pre>