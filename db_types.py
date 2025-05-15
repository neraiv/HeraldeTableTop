from enum import Enum


class SocketUpdatePrior(Enum):
    IMMEDIATELY = 0
    WHEN_AVALIABLE = 1

class TypeError(Enum):
    FILE_NOT_FOUND = "File not found"
    JSON_PARSE_ERROR = "Json parse error"
    UNKNOWN_REQUEST_TYPE = "Got unknown request type!"
    INSUFFİCENT_DATA = "Not provided enough data to parse!"
    
class TypeQuestStatus(Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in_progress"
    NOT_AVAILABLE = "not_available"
    OK = "ok"
    
    
class Where(Enum):
    FROM_DEFAULTS = 0
    FROM_SESSION = 1
    FROM_ROOT = 2
    
class ServerInfoHolder(object):
    def __init__(self):
        self.info : dict = None 
        self.users : dict = None
    
class DataHolder(object):
    def __init__(self):
        self.session_info : dict = None 
        self.rules : dict = None        
        self.spells : dict = None       
        self.chars : dict = None        
        self.scenes : dict = None       
        self.objects : dict = None      
        self.quests : dict = None       
        self.npcs : dict = None         
        self.summonables : dict = None  
        
        
        
        
        
        
        
        
        