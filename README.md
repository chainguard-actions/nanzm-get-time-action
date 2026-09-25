# Get Time Action

Get the time in the specified time zone

## Example usage

```yaml
      - name: Get Time
        id: time
        uses: nanzm/get-time-action@v1.0
        with:
          timeZone: 8
          format: 'YYYY-MM-DD-HH-mm-ss'
      - name: Usage
        env:
          TIME: "${{ steps.time.outputs.time }}"
        run: |
          echo $TIME
```

## Inputs

| Parameter  | Required | Info                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| `timeZone` | `false`  | time Zone  Default: 0                                        |
| `format`   | `false`  | timestamp format string  Default: ''                                    |


## Outputs

| Parameter   | Info                                                         |
| ---------- | ------------------------------------------------------------ |
| `time`   | time in the specified time zone|



## License

[MIT](LICENSE)

## Privacy

This Action contacts Chainguard's licensing server to verify authorization. Connection metadata (IP address, GitHub repository identifier, timestamp, and any metadata encoded in the auth token) is transmitted to Chainguard, Inc. even if authorization is denied in accordance with our [Privacy Notice](https://www.chainguard.dev/legal/privacy-notice)
