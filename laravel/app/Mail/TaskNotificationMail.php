<?php

namespace App\Mail;

// require_once(__DIR__ . "/../../vendor/autoload.php");

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Swift_Mailer;
use Swift_Message;
use Swift_SendmailTransport;
use Swift_SmtpTransport;

class TaskNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public $viewName = 'emails.task_deadline';

    public $mailSubject = 'Your task is approaching the deadline!';

    public $emailTo;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $emailTo, $data)
    {
        $this->data = $data;
        $this->emailTo = $emailTo;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Task Notification Mail',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: $this->view,
            with: $this->data
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }

    public function build()
    {
        $address = env('MAIL_FROM_ADDRESS');
        $name = env('MAIL_FROM_NAME');

        // $this->log($this->data['message']);

        return $this->view($this->viewName)
            ->from($address, $name)
            // ->cc($address, $name)
            // ->bcc($address, $name)
            ->replyTo($address, $name)
            ->subject($this->subject)
            ->with(['task_message' => 'example']);
    }

    public function createAndSend()
    {
        $address = env('MAIL_FROM_ADDRESS');
        $name = env('MAIL_FROM_NAME');

        $transport = new Swift_SendmailTransport( '/usr/sbin/sendmail -t' );

        $transport = (new Swift_SmtpTransport(env('MAIL_HOST'), env('MAIL_PORT')))
            ->setUsername(env('MAIL_USERNAME'))
            ->setPassword(env('MAIL_PASSWORD'));

        // Create the Mailer using your created Transport
        $mailer = new Swift_Mailer($transport);

        // Create a message
        $message = (new Swift_Message($this->mailSubject))
            ->setFrom([$address => $name])
            ->setTo(['jones.godel@gmail.com'])
            // ->setTo([$this->emailTo => $this->emailTo])
            ->setBody('Here is the message itself');

        // Send the message
        $result = $mailer->send($message);

        print_r($result);
    }

    public function send_test(string $emailTo, $data)
    {
        $address = env('MAIL_FROM_ADDRESS');
        $name = env('MAIL_FROM_NAME');

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'https://api.sendgrid.com/v3/mail/send');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'personalizations' => [
                ['to' => [
                    ['email' => $emailTo]
                ]]
            ],
            'from' => ['email' => $address, 'name' => $name],
            'subject' => $this->mailSubject,
            'content' => [
                ['type' => 'text/plain', 'value' => 'This is an example!']
            ]
        ]));

        $headers = array();
        $headers[] = 'Authorization: Bearer ' . env('MAIL_PASSWORD');
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            print 'Error:' . curl_error($ch);
        } else {
            print "SUCCESSS!";
        }
        curl_close($ch);
    }
}
