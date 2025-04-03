class PermissonHandeler():
    def __init__(self):
        pass
    
    def check_permission(self, role, action):
        return self.permissions[role][action]
    
    def getItem(self, inventory, item):
        return inventory.get(item, None)
    
    def getCurrency(self, inventory) -> tuple[float, float, float]:
        currencyt_dict: dict = inventory['currency']
        gold = currencyt_dict.get('gold', 0)
        silver = currencyt_dict.get('silver', 0)
        copper = currencyt_dict.get('copper', 0)
        return gold, silver, copper
        
    def check_buy(self, data):
        source = data['source']
        inventory = data['inventory']
        item = data['item']
        price = data['price']
        
        item_data = self.getItem(source, inventory)
        gold, silver, copper = self.getCurrency(item_data)
        
        if gold < price['gold']:
            return False
        if silver < price['silver']:
            return False
        if copper < price['copper']:
            return False
        return True
    
    def check_sell(self, data):
        source = data['source']
        inventory = data['inventory']
        price = data['price']
        
        item_data = self.getItem(source, inventory)
        gold, silver, copper = self.getCurrency(item_data)
        
        if gold < price['gold']:
            return False
        if silver < price['silver']:
            return False
        if copper < price['copper']:
            return False
        return True
    
    def check_transfer(self, data):
        source = data['source']
        destination = data['destination']
        inventory = data['inventory']
        
        source_data = self.getItem(source, inventory)
        destination_data = self.getItem(destination, inventory)
        
        if source_data is None:
            return False
        if destination_data is None:
            return False
        return True
    
    def check_item_transaction(self, data):
        transaction_type = data['type']
        
        if transaction_type == 'buy':
            return self.check_buy(data)
        elif transaction_type == 'sell':
            return self.check_sell(data)
        elif transaction_type == 'transfer':
            return self.check_transfer(data)
    
    def check_currency_transaction(self, data):  
        source = self.getCurrency(data['source'])
        destination = self.getCurrency(data['destination'])
        if source is None:
            return False
        if destination is None:
            return False
        
        if source < destination:
            return False
        return True
            
        