# **VaultGen CLI**

### **Description**

**VaultGen** is a minimalist, terminal-based password manager designed for developers who value security and efficiency. 
Built to operate entirely within the CLI, it leverages local master key encryption to ensure your credentials never leave your machine. With intuitive commands, it streamlines the process of generating, storing, and accessing passwords while keeping your workflow focused and clutter-free.

### **How does it work?**

VaultGen uses a local master key to encrypt all credentials stored in the vault using `AES-256-GCM` algorithm. This ensures that your credentials are secure and cannot be accessed without the master key. The algorithm usages an **initialization vector** (IV) of 12 bytes guaranteeing that the same ciphertext with the same key will generate different ciphertexts each time. Also, the algorithm uses a **salt** of 32 bytes to prevent attackers from using precomputed tables to crack the key.

The master key never touches the disk, ensuring that it only lives in RAM during the session.

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