# **VaultGen CLI**

### **Description**

**VaultGen** is a minimalist, terminal-based password manager designed for developers who value security and efficiency. 
Built to operate entirely within the CLI, it leverages local master key encryption to ensure your credentials never leave your machine. With intuitive commands, it streamlines the process of generating, storing, and accessing passwords while keeping your workflow focused and clutter-free.

### **How does it work?**

VaultGen uses a user-provided password to securely encrypt all credentials using the `AES-256-GCM` algorithm. Instead of using the password directly, a cryptographic key is derived from it using the `scrypt` key derivation function. This derived key is what is actually used for encryption.

`AES-256-GCM` uses a **12-byte** initialization vector (IV), randomly generated for each encryption. This ensures that encrypting the same plaintext with the same key produces different ciphertext every time, providing semantic security.

A **32-byte** salt is also used during key derivation. The salt ensures that the same password will produce different derived keys, preventing attacks based on precomputed tables such as rainbow tables.

The user password is never stored and only exists in memory during the session.

`AES-256-GCM` also provides built-in authentication via an authentication tag. This ensures that encrypted data cannot be tampered with without detection.

### **Installation**

**Available April 15, 2026**

Using `npm`:

```bash
npm install -g vaultgen
```

Using `pnpm`:

```bash
pnpm install -g vaultgen
```

Using `yarn`:

### **Usage**

```bash
# Create a new vault
vaultgen init

# Add a new credential to the vault
vaultgen new

# List all credentials in the vault and copy to clipboard
vaultgen list

# Remove a credential from the vault
vaultgen delete

# Update an existing credential
vaultgen update

# Analyze all credentials for security vulnerabilities
vaultgen audit

# Completely wipe the vault — all credentials, metadata and config
vaultgen reset
```

### **Commands**

| **Command** | **Description** |
| --- | --- |
| `vaultgen init` | Initialize the local vault. |
| `vaultgen new` | Add a new credential to the vault. |
| `vaultgen list` | List all credentials in the vault and copy to clipboard. |
| `vaultgen delete` | Remove a credential from the vault. |
| `vaultgen update` | Update an existing credential. |
| `vaultgen audit` | Analyze all credentials for security vulnerabilities. |
| `vaultgen reset` | Completely wipe the vault — all credentials, metadata and config. |


### **License**

MIT License