import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from server import app, getScene_func

class TestServer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = app.test_client()
        cls.app.testing = True

    @patch('server.getGameFile')
    @patch('server.controlKey')
    def test_getScene_func_success(self, mock_controlKey, mock_getGameFile):
        mock_controlKey.return_value = ('test_user', {'character': 'test_char'})
        mock_getGameFile.side_effect = [
            {
                "test_scene": {
                    "discovered": False,
                    "requirements": {
                        "type": "item",
                        "item": "test_item",
                        "amount": 1,
                        "after": "remove"
                    }
                }
            },
            {
                "test_char": {
                    "inventory": {
                        "test_item": 1
                    }
                }
            }
        ]

        with app.test_request_context('/getScene?key=test_key&sceneName=test_scene'):
            response = getScene_func()
            self.assertEqual(response, 200)
            self.assertIn('success', response.json)

    @patch('server.getGameFile')
    @patch('server.controlKey')
    def test_getScene_func_missing_key_or_sceneName(self, mock_controlKey, mock_getGameFile):
        with app.test_request_context('/getScene?key=test_key'):
            response = getScene_func()
            self.assertEqual(response, 400)
            self.assertIn('error', response.json)

    @patch('server.getGameFile')
    @patch('server.controlKey')
    def test_getScene_func_user_not_found(self, mock_controlKey, mock_getGameFile):
        mock_controlKey.return_value = (None, None)
        with app.test_request_context('/getScene?key=test_key&sceneName=test_scene'):
            response = getScene_func()
            self.assertEqual(response, 404)
            self.assertIn('error', response.json)

    @patch('server.getGameFile')
    @patch('server.controlKey')
    def test_getScene_func_scene_not_found(self, mock_controlKey, mock_getGameFile):
        mock_controlKey.return_value = ('test_user', {'character': 'test_char'})
        mock_getGameFile.return_value = {}
        with app.test_request_context('/getScene?key=test_key&sceneName=test_scene'):
            response = getScene_func()
            self.assertEqual(response, 404)
            self.assertIn('error', response.json)

    @patch('server.getGameFile')
    @patch('server.controlKey')
    def test_getScene_func_character_not_found(self, mock_controlKey, mock_getGameFile):
        mock_controlKey.return_value = ('test_user', {'character': 'test_char'})
        mock_getGameFile.side_effect = [
            {
                "test_scene": {
                    "discovered": False,
                    "requirements": {
                        "type": "item",
                        "item": "test_item",
                        "amount": 1,
                        "after": "remove"
                    }
                }
            },
            {}
        ]
        with app.test_request_context('/getScene?key=test_key&sceneName=test_scene'):
            response = getScene_func()
            self.assertEqual(response, 404)
            self.assertIn('error', response.json)

    @patch('server.getGameFile')
    @patch('server.controlKey')
    def test_getScene_func_item_not_found(self, mock_controlKey, mock_getGameFile):
        mock_controlKey.return_value = ('test_user', {'character': 'test_char'})
        mock_getGameFile.side_effect = [
            {
                "test_scene": {
                    "discovered": False,
                    "requirements": {
                        "type": "item",
                        "item": "test_item",
                        "amount": 1,
                        "after": "remove"
                    }
                }
            },
            {
                "test_char": {
                    "inventory": {}
                }
            }
        ]
        with app.test_request_context('/getScene?key=test_key&sceneName=test_scene'):
            response = getScene_func()
            self.assertEqual(response, 404)
            self.assertIn('error', response.json)

if __name__ == '__main__':
    unittest.main()