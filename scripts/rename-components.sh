#!/bin/bash

# Script to rename single-word Vue components to multi-word components

# List of single-word component names that need to be renamed
declare -A rename_map=(
  ["Login.vue"]="LoginPage.vue"
  ["Dashboard.vue"]="DashboardPage.vue"
  ["Products.vue"]="ProductsPage.vue"
  ["Orders.vue"]="OrdersPage.vue"
  ["Customers.vue"]="CustomersPage.vue"
  ["Employees.vue"]="EmployeesPage.vue"
  ["Discounts.vue"]="DiscountsPage.vue"
  ["Coupons.vue"]="CouponsPage.vue"
  ["NotFound.vue"]="NotFoundPage.vue"
)

# Path to the views directory
VIEWS_DIR="./src/views"

# Check if views directory exists
if [ ! -d "$VIEWS_DIR" ]; then
  echo "Error: Views directory not found at $VIEWS_DIR"
  exit 1
fi

# Loop through each file in the rename map
for old_name in "${!rename_map[@]}"; do
  new_name="${rename_map[$old_name]}"
  old_path="$VIEWS_DIR/$old_name"
  new_path="$VIEWS_DIR/$new_name"
  
  # Check if the old file exists
  if [ -f "$old_path" ]; then
    echo "Renaming $old_name to $new_name..."
    
    # Create temporary file with updated component name
    temp_file=$(mktemp)
    
    # Extract component name without extension
    old_component_name="${old_name%.*}"
    new_component_name="${new_name%.*}"
    
    # Update component name in script tag if it exists
    if grep -q "name:\s*['\"]$old_component_name['\"]" "$old_path"; then
      sed "s/name:\s*['\"]$old_component_name['\"]/name: '$new_component_name'/g" "$old_path" > "$temp_file"
      mv "$temp_file" "$old_path"
    fi
    
    # Rename the file
    git mv "$old_path" "$new_path"
    
    echo "Successfully renamed $old_name to $new_name"
  else
    echo "Warning: $old_path does not exist, skipping"
  fi
done

# Update router references
ROUTER_FILE="./src/router/index.js"
if [ -f "$ROUTER_FILE" ]; then
  echo "Updating router references..."
  
  temp_file=$(mktemp)
  
  # Replace component imports in router file
  for old_name in "${!rename_map[@]}"; do
    old_component_name="${old_name%.*}"
    new_component_name="${rename_map[$old_name]%.*}"
    
    # Update import statements
    sed "s/import\s\+$old_component_name\s\+from\s\+['\"]\@\/views\/$old_component_name['\"]*/import $new_component_name from '\@\/views\/$new_component_name'/g" "$ROUTER_FILE" > "$temp_file"
    mv "$temp_file" "$ROUTER_FILE"
    
    # Update component references in routes
    sed "s/component:\s*$old_component_name/component: $new_component_name/g" "$ROUTER_FILE" > "$temp_file"
    mv "$temp_file" "$ROUTER_FILE"
  done
  
  echo "Router references updated"
fi

echo "Component renaming completed."
