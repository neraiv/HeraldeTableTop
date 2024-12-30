class PermissonHandeler():
    def __init__(self):
        pass
    
    def check_permission(self, role, action):
        return self.permissions[role][action]
    
    def charGetItem(self, inventory, item):
        if item in inventory:
            return inventory[item]
        return None
        
    
    def check_item_transaction(self, data):
        if self.charGetItem(data['source'], data['inventory']) == None:
            return False
        pass