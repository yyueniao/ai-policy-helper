import re
from typing import Generator

class StreamGuard:
    NRIC_PATTERN = r'\d{6}-?\d{2}-?\d{4}'
    PHONE_PATTERN = r'(\+?6?01[0-9]-?\d{7,8})'
    
    def __init__(self, window_size: int = 25):
        self.buffer = ""
        self.window_size = window_size

    def mask(self, token_stream: Generator[str, None, None]) -> Generator[str, None, None]:
        for token in token_stream:
            self.buffer += token
            
            processed = re.sub(self.NRIC_PATTERN, "[MASKED_NRIC]", self.buffer)
            processed = re.sub(self.PHONE_PATTERN, "[MASKED_PHONE]", processed)
            
            if len(processed) > self.window_size:
                release_idx = len(processed) - self.window_size
                yield processed[:release_idx]
                self.buffer = processed[release_idx:]
            else:
                self.buffer = processed

        if self.buffer:
            yield self.buffer