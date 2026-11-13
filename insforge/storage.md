# InsForge Storage Configuration

## Storage Bucket: `rfq-attachments`

This bucket stores confidential Bill of Materials (BOM), CAD drawings (`.step`, `.dwg`), technical specification sheets (`.pdf`), and inspection documentation uploaded by buyers during RFQ creation.

### Bucket Specifications
- **Bucket Name:** `rfq-attachments`
- **Visibility:** Private (Authenticated & owner-only access via signed URLs or SDK tokens)
- **Max File Size:** 20 MB per file
- **Allowed MIME Types / File Extensions:**
  - Documents: `.pdf`, `.xlsx`, `.csv` (`application/pdf`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/csv`)
  - CAD / Engineering: `.step`, `.stp`, `.dwg`, `.dxf` (`application/step`, `application/acad`, `image/vnd.dwg`)
  - Images / Diagrams: `.png`, `.jpg`, `.jpeg` (`image/png`, `image/jpeg`)

### Setup via InsForge CLI
Run the following command to provision the bucket:

```bash
npx -y @insforge/cli storage create-bucket rfq-attachments --private
```

### Storage Access Policies (PostgreSQL RLS on `storage.objects`)

To ensure buyers can only read and manage their own RFQ attachments:

```sql
-- Allow authenticated buyers to upload to their user folder
CREATE POLICY "Buyers can upload RFQ attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rfq-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow buyers and quoted suppliers to read attachments
CREATE POLICY "Authorized users can read RFQ attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'rfq-attachments' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.rfqs
      JOIN public.quotes ON quotes.rfq_id = rfqs.id
      WHERE rfqs.attachment_keys ? storage.filename(name)
    )
  )
);
```
