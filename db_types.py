from enum import Enum


class SocketUpdatePrior(Enum):
    IMMEDIATELY = 0
    WHEN_AVALIABLE = 1

class DatabaseWhere(Enum):
    FROM_DEFAULTS = 0
    FROM_SESSION = 1
    FROM_ROOT = 2
    
class TypeError(Enum):
    FILE_NOT_FOUND = "File not found"
    JSON_PARSE_ERROR = "Json parse error"
    UNKNOWN_REQUEST_TYPE = "Got unknown request type!"
    
class TypeQuestStatus(Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in_progress"
    NOT_AVAILABLE = "not_available"
    OK = "ok"