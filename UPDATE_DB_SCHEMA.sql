-- Run these commands in your MySQL database to update the schema

-- Add branch_id column to staff table
ALTER TABLE staff ADD COLUMN branch_id VARCHAR(50) AFTER institute_id;

-- Add foreign key constraint (optional, but recommended)
-- Ensure that the branches table exists before running this
ALTER TABLE staff ADD CONSTRAINT fk_staff_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id);

-- Add department column to staff table
ALTER TABLE staff ADD COLUMN department VARCHAR(100) AFTER employee_id;

-- Add branch_id column to batches table
ALTER TABLE batches ADD COLUMN branch_id VARCHAR(36) AFTER institute_id;
ALTER TABLE batches ADD CONSTRAINT fk_batches_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE SET NULL;
